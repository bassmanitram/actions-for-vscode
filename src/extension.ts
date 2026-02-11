import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CustomAction {
  id: string;
  label: string;
  command: string;
  contexts?: string[];
  icon?: string;
  showNotification?: boolean;
  enabled?: boolean;
}

export function activate(context: vscode.ExtensionContext) {
  let registeredCommands: vscode.Disposable[] = [];

  function registerActions() {
    // Dispose of all previously registered commands
    registeredCommands.forEach(cmd => cmd.dispose());
    registeredCommands = [];

    const config = vscode.workspace.getConfiguration('actionsForVscode');
    const actions = config.get<CustomAction[]>('actions', []);
    const timeout = config.get<number>('commandTimeout', 30000);
    const useSubmenu = config.get<boolean>('useSubmenu', false);

    // Register individual commands for each action
    actions.forEach(action => {
      if (action.enabled === false) {
        return;
      }

      if (!action.id || !action.label || !action.command) {
        console.warn('Skipping action with missing required fields:', action);
        return;
      }

      const commandId = `actionsForVscode.${action.id}`;
      
      const disposable = vscode.commands.registerCommand(
        commandId,
        async (uri: vscode.Uri, selectedFiles?: vscode.Uri[]) => {
          await executeAction(action, uri, selectedFiles, timeout);
        }
      );

      registeredCommands.push(disposable);
      context.subscriptions.push(disposable);
    });

    // Register submenu picker commands (always available for command palette)
    const explorerPickerCmd = vscode.commands.registerCommand(
      'actionsForVscode.showExplorerActions',
      async (uri: vscode.Uri, selectedFiles?: vscode.Uri[]) => {
        await showActionPicker(uri, selectedFiles, 'explorer', timeout);
      }
    );
    registeredCommands.push(explorerPickerCmd);
    context.subscriptions.push(explorerPickerCmd);

    const scmPickerCmd = vscode.commands.registerCommand(
      'actionsForVscode.showScmActions',
      async (uri: vscode.Uri) => {
        await showActionPicker(uri, undefined, 'scm', timeout);
      }
    );
    registeredCommands.push(scmPickerCmd);
    context.subscriptions.push(scmPickerCmd);

    const editorPickerCmd = vscode.commands.registerCommand(
      'actionsForVscode.showEditorActions',
      async () => {
        const uri = vscode.window.activeTextEditor?.document.uri;
        await showActionPicker(uri, undefined, 'editor', timeout);
      }
    );
    registeredCommands.push(editorPickerCmd);
    context.subscriptions.push(editorPickerCmd);

    console.log(`Actions For VSCode: Registered ${actions.length} actions (submenu mode: ${useSubmenu})`);
  }

  // Initial registration
  registerActions();

  // Re-register when configuration changes
  const configWatcher = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('actionsForVscode')) {
      console.log('Actions For VSCode: Configuration changed, re-registering...');
      registerActions();
    }
  });
  context.subscriptions.push(configWatcher);

  // Command to open settings
  const openSettingsCmd = vscode.commands.registerCommand(
    'actionsForVscode.openSettings',
    () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'actionsForVscode'
      );
    }
  );
  context.subscriptions.push(openSettingsCmd);

  console.log('Actions For VSCode extension activated');
}

async function showActionPicker(
  uri: vscode.Uri | undefined,
  selectedFiles: vscode.Uri[] | undefined,
  contextType: string,
  timeout: number
) {
  if (!uri && vscode.window.activeTextEditor) {
    uri = vscode.window.activeTextEditor.document.uri;
  }

  if (!uri) {
    vscode.window.showErrorMessage('No file or folder selected.');
    return;
  }

  const config = vscode.workspace.getConfiguration('actionsForVscode');
  const actions = config.get<CustomAction[]>('actions', []);

  // Filter actions based on context and enabled state
  const availableActions = actions.filter(action => {
    if (action.enabled === false) {
      return false;
    }
    
    const contexts = action.contexts || ['explorer'];
    return contexts.includes(contextType);
  });

  if (availableActions.length === 0) {
    vscode.window.showInformationMessage(`No actions configured for ${contextType} context.`);
    return;
  }

  // Build quick pick items
  const items: vscode.QuickPickItem[] = availableActions.map(action => ({
    label: action.label,
    description: action.command,
    detail: `Execute: ${action.command}`,
    iconPath: action.icon ? new vscode.ThemeIcon(action.icon) : undefined,
    action: action
  } as any));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select an action to execute',
    matchOnDescription: true
  });

  if (selected && (selected as any).action) {
    const action = (selected as any).action as CustomAction;
    await executeAction(action, uri, selectedFiles, timeout);
  }
}

async function executeAction(
  action: CustomAction,
  uri: vscode.Uri | undefined,
  selectedFiles: vscode.Uri[] | undefined,
  timeout: number
) {
  if (!uri) {
    vscode.window.showErrorMessage('No file or folder selected.');
    return;
  }

  // Only work with local files
  if (uri.scheme !== 'file') {
    vscode.window.showErrorMessage('This command only works with local files.');
    return;
  }

  const showNotification = action.showNotification !== false;
  const filePath = uri.fsPath;
  
  // Build final command - replace placeholders
  let finalCommand = action.command;
  
  // Replace {file} placeholder
  if (finalCommand.includes('{file}')) {
    finalCommand = finalCommand.replace(/{file}/g, `"${filePath}"`);
  } else if (!finalCommand.includes('{files}')) {
    // Auto-append file path if no placeholder exists
    finalCommand = `${finalCommand} "${filePath}"`;
  }

  // Replace {files} for multiple selection
  if (selectedFiles && selectedFiles.length > 0) {
    const filePaths = selectedFiles.map(f => `"${f.fsPath}"`).join(' ');
    finalCommand = finalCommand.replace(/{files}/g, filePaths);
  } else {
    // Fallback to single file if no multi-selection
    finalCommand = finalCommand.replace(/{files}/g, `"${filePath}"`);
  }

  // Replace {dir} with directory of file
  const dir = uri.fsPath.substring(0, uri.fsPath.lastIndexOf('/'));
  finalCommand = finalCommand.replace(/{dir}/g, `"${dir}"`);

  // Replace {filename} with just the filename (no path)
  const filename = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1);
  finalCommand = finalCommand.replace(/{filename}/g, `"${filename}"`);

  try {
    if (showNotification) {
      vscode.window.showInformationMessage(`Executing: ${action.label}`);
    }

    // Execute command in background
    const { stdout, stderr } = await execAsync(finalCommand, {
      cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || dir,
      timeout: timeout
    });

    // Log output to console
    if (stdout) {
      console.log(`[${action.id}] stdout:`, stdout);
    }
    if (stderr && stderr.trim()) {
      console.warn(`[${action.id}] stderr:`, stderr);
    }

    if (showNotification) {
      vscode.window.showInformationMessage(`${action.label} completed.`);
    }
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    console.error(`[${action.id}] execution failed:`, error);
    vscode.window.showErrorMessage(`${action.label} failed: ${errorMessage}`);
  }
}

export function deactivate() {}
