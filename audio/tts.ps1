# audio/tts.ps1 — 用系统中文语音（Microsoft Huihui）离线合成旁白
# 输出：projects/material/vo/vo_<id>.wav（48kHz/16bit/mono）+ vo_manifest.json
# 说明：不是生成式模型；只是把文字按 SSML 念出来，便于逐句对齐时间线。

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$narrationPath = Join-Path $PSScriptRoot 'narration.json'
$voDir = Join-Path $root 'projects\material\vo'
New-Item -ItemType Directory -Path $voDir -Force | Out-Null
$ffprobe = 'D:\installpath\Peach\tools\ffmpeg\bin\ffprobe.exe'

$spec = Get-Content -Raw -LiteralPath $narrationPath -Encoding UTF8 | ConvertFrom-Json
$voice = $null
foreach ($v in [System.Speech.Synthesis.SpeechSynthesizer]::new().GetInstalledVoices()) {
  if ($v.VoiceInfo.Name -like '*Huihui*') { $voice = $v.VoiceInfo.Name }
}
if (-not $voice) { throw 'no Chinese voice found' }
Write-Output "voice = $voice"

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice($voice)
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
$synth.SetOutputToNull()

function Get-WavSeconds([string]$path) {
  $raw = & $ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 $path 2>$null
  return [double]($raw | Select-Object -First 1)
}

$manifest = @()
foreach ($line in $spec.lines) {
  $out = Join-Path $voDir ("vo_{0}.wav" -f $line.id)
  $best = $null
  foreach ($rate in @(0, 1, 2, 3, 4)) {
    $synth.Rate = $rate
    $synth.SetOutputToWaveFile($out, $fmt)
    $synth.Speak($line.text)
    $synth.SetOutputToNull()
    $dur = Get-WavSeconds $out
    $best = [pscustomobject]@{ rate = $rate; dur = $dur }
    if ($dur -le $line.win) { break }
  }
  $ok = if ($best.dur -le $line.win) { 'OK' } else { 'OVER' }
  Write-Output ("{0} t={1,7:N2} win={2,4:N1} rate={3} dur={4,5:N2} {5}" -f $line.id, $line.t, $line.win, $best.rate, $best.dur, $ok)
  $manifest += [pscustomobject]@{
    id = $line.id; t = [double]$line.t; win = [double]$line.win
    rate = $best.rate; dur = [math]::Round($best.dur, 3)
    text = $line.text; file = "vo_$($line.id).wav"; fit = $ok
  }
}
$synth.Dispose()

$manifestPath = Join-Path $voDir 'vo_manifest.json'
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
$bad = @($manifest | Where-Object { $_.fit -ne 'OK' })
Write-Output ("manifest -> {0} ; lines={1} ; over={2}" -f $manifestPath, $manifest.Count, $bad.Count)
