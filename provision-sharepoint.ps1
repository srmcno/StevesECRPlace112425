param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl
)

if ($PSBoundParameters.ContainsKey('SiteUrl')) {
    Connect-PnPOnline -Url $SiteUrl -Interactive
}

Write-Host "Creating Categories list" -ForegroundColor Cyan
$categories = Get-PnPList -Identity "Categories" -ErrorAction SilentlyContinue
if (-not $categories) {
    $categories = New-PnPList -Title "Categories" -Template GenericList -Url "Lists/Categories" -OnQuickLaunch:$true
}

Write-Host "Ensuring Requests list" -ForegroundColor Cyan
$requests = Get-PnPList -Identity "Requests" -ErrorAction SilentlyContinue
if (-not $requests) {
    $requests = New-PnPList -Title "Requests" -Template GenericList -Url "Lists/Requests" -OnQuickLaunch:$true
}
Set-PnPList -Identity $requests -EnableAttachments:$true -ValidationFormula "=[DueDate]>=TODAY()" -ValidationMessage "Due Date must be today or later." | Out-Null

Write-Host "Ensuring Categories lookup" -ForegroundColor Cyan
$fieldXml = @"
<Field Type="Lookup" DisplayName="Category" Required="TRUE" List="{$($categories.Id)}" ShowField="Title" RelationshipDeleteBehavior="Restrict" />
"@
$existingCategoryField = Get-PnPField -List $requests -Identity "Category" -ErrorAction SilentlyContinue
if (-not $existingCategoryField) {
    Add-PnPFieldFromXml -List $requests -FieldXml $fieldXml | Out-Null
}

Write-Host "Ensuring Requests fields" -ForegroundColor Cyan
$priorityChoices = @('High','Medium','Low')
$statusChoices = @('Active','In Progress','Blocked','Resolved','Closed')

$priorityField = Get-PnPField -List $requests -Identity "Priority" -ErrorAction SilentlyContinue
if (-not $priorityField) {
    Add-PnPField -List $requests -DisplayName "Priority" -InternalName "Priority" -Type Choice -AddToDefaultView -Choices $priorityChoices -Group "Custom Columns" | Out-Null
}
$statusField = Get-PnPField -List $requests -Identity "Status" -ErrorAction SilentlyContinue
if (-not $statusField) {
    Add-PnPField -List $requests -DisplayName "Status" -InternalName "Status" -Type Choice -AddToDefaultView -Choices $statusChoices -Group "Custom Columns" | Out-Null
}
$dueDateField = Get-PnPField -List $requests -Identity "DueDate" -ErrorAction SilentlyContinue
if (-not $dueDateField) {
    Add-PnPField -List $requests -DisplayName "Due Date" -InternalName "DueDate" -Type DateTime -AddToDefaultView -Group "Custom Columns" | Out-Null
}

Write-Host "Applying color chips to choice fields" -ForegroundColor Cyan
$priorityFormatting = @'
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "div",
  "txtContent": "=if(@currentField == '' , 'Not set', @currentField)",
  "style": {
    "padding": "4px 8px",
    "border-radius": "999px",
    "font-weight": "600",
    "display": "inline-block",
    "color": "white",
    "background-color": "=if(@currentField == 'High', '#a4262c', if(@currentField == 'Medium', '#c19c00', if(@currentField == 'Low', '#107c10', '#8a8886')) )"
  }
}
'@
$priorityField = Get-PnPField -List $requests -Identity "Priority"
Set-PnPField -List $requests -Identity $priorityField.Id -Values @{ CustomFormatter = $priorityFormatting } | Out-Null

$statusFormatting = @'
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "div",
  "txtContent": "=if(@currentField == '' , 'Not set', @currentField)",
  "style": {
    "padding": "4px 8px",
    "border-radius": "999px",
    "font-weight": "600",
    "display": "inline-block",
    "color": "white",
    "background-color": "=if(@currentField == 'Active', '#005a9e', if(@currentField == 'In Progress', '#c19c00', if(@currentField == 'Blocked', '#a4262c', if(@currentField == 'Resolved', '#107c10', '#8a8886'))))"
  }
}
'@
$statusField = Get-PnPField -List $requests -Identity "Status"
Set-PnPField -List $requests -Identity $statusField.Id -Values @{ CustomFormatter = $statusFormatting } | Out-Null

Write-Host "Creating optional ConfigPriority list" -ForegroundColor Cyan
$configPriority = Get-PnPList -Identity "ConfigPriority" -ErrorAction SilentlyContinue
if (-not $configPriority) {
    $configPriority = New-PnPList -Title "ConfigPriority" -Template GenericList -Url "Lists/ConfigPriority" -OnQuickLaunch:$false
    Add-PnPField -List $configPriority -DisplayName "Order" -InternalName "Order0" -Type Number -Group "Custom Columns" | Out-Null
    Add-PnPField -List $configPriority -DisplayName "Color" -InternalName "Color" -Type Text -Group "Custom Columns" | Out-Null
}

Write-Host "Creating optional Comments list" -ForegroundColor Cyan
$comments = Get-PnPList -Identity "Comments" -ErrorAction SilentlyContinue
if (-not $comments) {
    $comments = New-PnPList -Title "Comments" -Template GenericList -Url "Lists/Comments" -OnQuickLaunch:$false
    Add-PnPField -List $comments -DisplayName "Request" -InternalName "RequestLookup" -Type Lookup -LookupList $requests.Id -LookupField "Title" -RelationshipDeleteBehavior Restrict -AddToDefaultView | Out-Null
    Add-PnPField -List $comments -DisplayName "Comment" -InternalName "CommentBody" -Type Note -RichText:$false -AddToDefaultView -Group "Custom Columns" | Out-Null
}

Write-Host "Provisioning complete" -ForegroundColor Green
