$baseUrl = 'https://sanbanfu-gu4rabz79-iankwans-projects.vercel.app/'
$localRoot = 'e:/SD/bazi/sanbanfu/'

$files = @(
    'index.html',
    'paipan.html',
    'script-tool.html',
    'script-tool_fixed.html',
    'pattern_editor.html',
    'manifest.json',
    'vercel.json',
    'tree_data.json',
    'discussion_notes.md',
    '11.md',
    'js/bazi_logic.js',
    'js/bazi_narrative.js',
    'js/bazi_narrative.js.bak',
    'js/analysis_engine.js',
    'js/decision_engine.js',
    'js/life_death_logic.js',
    'js/lunar.js',
    'js/tree_viewer.js',
    'js/ui_render_global.js',
    'js/year_map.js',
    'js/pattern_editor.js',
    'js/pattern_engine.js',
    'js/pattern_extractor.js',
    'js/tree_data_static.js',
    'js/mock_window.js',
    'js/tail.js.tmp',
    'js/rules/wealth_tree.js',
    'js/rules/marriage_tree.js',
    'js/rules/academic_tree.js',
    'js/rules/career_tree.js',
    'js/rules/sexlife_tree.js',
    'js/rules/children_tree.js',
    'js/rules/legal_tree.js',
    'js/rules/personality_tree.js',
    'js/formulas/wealth_patterns.js',
    'js/formulas/academic_patterns.js',
    'js/formulas/marriage_patterns.js',
    'js/formulas/career_patterns.js',
    'js/formulas/sex_life_patterns.js',
    'js/formulas/children_patterns.js',
    'js/formulas/legal_patterns.js',
    'css/style.css'
)

foreach ($f in $files) {
    $targetPath = Join-Path $localRoot $f
    $targetDir = Split-Path $targetPath
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
    try {
        Invoke-WebRequest -Uri ($baseUrl + $f) -OutFile $targetPath -ErrorAction Stop
        Write-Host ('OK: ' + $f) -ForegroundColor Green
    } catch {
        Write-Host ('FAIL: ' + $f + ' (HTTP ' + $_.Exception.Response.StatusCode.Value__ + ')') -ForegroundColor Yellow
    }
}
Write-Host 'Restoration Complete.' -ForegroundColor Cyan
