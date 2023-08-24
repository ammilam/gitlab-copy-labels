# Gitlab Label Copier

This application is a utility tool designed to copy labels from one GitLab group or project to another.

## Requirements

- Node.js

## Installations

1. Clone this repository.
1. Navigate to the repository directory.
1. Run npm install yargs to install required dependencies.

## Usage

### Running with Nodejs

```bash
node <filename>.js --type <type> --from <source_id> --to <destination_id> --url <gitlab_url> --token <access_token> [--dry_run]
```
### Running prebuilt executable

Download a binary from the [latest release](https://github.com/ammilam/gitlab-copy-labels/releases/tag/latest).

```bash
# make it executable
chmod +x gitlab-copy-labels
./gitlab-copy-labels --type <type> --from <source_id> --to <destination_id> --url <gitlab_url> --token <access_token> [--dry_run]

```

## Parameters

- --type: Specifies whether you are copying from/to a group or a project. Valid values are groups or projects. Default value is groups.
- --from: The ID of the source group or project from which you want to copy the labels.
- --to: The ID of the destination group or project to which you want to copy the labels.
- --url: The base URL of your GitLab instance. For example, https://gitlab.com.
- --token: Your GitLab private access token. You can also set this value using the ACCESS_TOKEN environment variable.
- --dry_run: Optional. If provided, the script will log the labels it would create without actually creating them.

## Example

```bash
node copyLabels.js --type groups --from 1234 --to 5678 --url https://gitlab.com --token YOUR_PRIVATE_TOKEN
```

This will copy all the labels from group with ID 1234 to group with ID 5678 in the GitLab instance at https://gitlab.com.

## Important Notes

1. Make sure you have the necessary permissions in both the source and destination groups/projects to fetch and create labels.
1. Labels existing in the destination but not in the source will remain untouched.
1. Duplicate labels (by name) between the source and destination will not be copied.
