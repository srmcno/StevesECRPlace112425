# SharePoint list provisioning

This repo contains a Power Apps canvas app. Use the accompanying PnP PowerShell script to provision the SharePoint lists it expects. The script creates mandatory lists (Requests, Categories) and optional lists (Comments, ConfigPriority), configures choice fields with color tags, and enforces lookup integrity and validation.

## Prerequisites
- [PnP.PowerShell](https://pnp.github.io/powershell/) installed.
- SharePoint site URL where the lists should be created.
- Account with permissions to create lists, columns, and manage relationships.

## Running the script
```powershell
# Install module if needed
# Install-Module PnP.PowerShell

$siteUrl = "https://contoso.sharepoint.com/sites/ecr"
Connect-PnPOnline -Url $siteUrl -Interactive

# Create mandatory and optional lists/fields
./provision-sharepoint.ps1
```

## What the script configures
- **Requests**: main intake list. Attachments are enabled. Validation formula enforces `DueDate >= Today()`.
- **Categories**: lookup source for requests. Deletions are restricted while requests reference a category.
- **Comments (optional)**: comment log tied to requests via a lookup.
- **ConfigPriority (optional)**: optional lookup/management list for priority metadata.

Color tags are applied via column formatting so the choice chips match the app theme: High = red, Medium = gold, Low = green; Active = blue, In Progress = gold, Blocked = red, Resolved = green, Closed = gray. Update the `CustomFormatter` JSON in the script if your theme uses different colors.
