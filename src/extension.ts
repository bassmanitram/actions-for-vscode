import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface CustomAction {
  id: string;
  label: string;
  command: string;
  cwd?: string;
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
  const fullFilePath = uri.fsPath;
  const filePath = path.parse(fullFilePath);
  const isDirectory = fs.existsSync(fullFilePath) && fs.statSync(fullFilePath).isDirectory();

  // Calculate default working directory
  let defaultWorkDir = filePath.dir; // Default to parent directory
  if (isDirectory) {
    // If it's a directory, use the full path to it
    defaultWorkDir = fullFilePath;
  }

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || defaultWorkDir;
  
  // Log parsed path info early for debugging
  console.log(`[${action.id}] === Path Parsing ===`);
  console.log(`[${action.id}] fullFilePath: ${fullFilePath}`);
  console.log(`[${action.id}] filePath.dir: ${filePath.dir}`);
  console.log(`[${action.id}] filePath.base: ${filePath.base}`);
  console.log(`[${action.id}] filePath.root: ${filePath.root}`);
  console.log(`[${action.id}] isDirectory: ${isDirectory}`);
  console.log(`[${action.id}] defaultWorkDir: ${defaultWorkDir}`);
  console.log(`[${action.id}] workspaceRoot: ${workspaceRoot}`);
  console.log(`[${action.id}] action.cwd config: ${action.cwd || '(not set)'}`);
  
  // Build final command - replace placeholders
  let finalCommand = action.command;
  
  // Replace {path} with full path
  finalCommand = finalCommand.replace(/{path}/g, `"${fullFilePath}"`);
  
  // Replace {file} with filename only
  finalCommand = finalCommand.replace(/{file}/g, `"${filePath.base}"`);
  
  // Replace {dir} with directory path
  finalCommand = finalCommand.replace(/{dir}/g, `"${filePath.dir}"`);
  
  // Replace {filename} (alias for {file})
  finalCommand = finalCommand.replace(/{filename}/g, `"${filePath.base}"`);
  
  // Replace {workspace} with workspace root
  finalCommand = finalCommand.replace(/{workspace}/g, `"${workspaceRoot}"`);

  // Replace {files} for multiple selection
  if (selectedFiles && selectedFiles.length > 0) {
    const filePaths = selectedFiles.map(f => `"${f.fsPath}"`).join(' ');
    finalCommand = finalCommand.replace(/{files}/g, filePaths);
  } else {
    // Fallback to single file if {files} is used but no multi-selection
    finalCommand = finalCommand.replace(/{files}/g, `"${fullFilePath}"`);
  }

  // Auto-append file path if no placeholder exists
  if (!action.command.includes('{') && !action.command.includes('}')) {
    finalCommand = `${finalCommand} "${fullFilePath}"`;
  }

  // Determine working directory
  let workingDir: string;
  if (action.cwd) {
    console.log(`[${action.id}] === CWD Replacement ===`);
    console.log(`[${action.id}] action.cwd before: ${action.cwd}`);
    
    // Replace placeholders in cwd
    workingDir = action.cwd
      .replace(/{path}/g, fullFilePath)
      .replace(/{file}/g, filePath.base)
      .replace(/{dir}/g, filePath.dir)
      .replace(/{workspace}/g, workspaceRoot);
    
    console.log(`[${action.id}] workingDir after replacement: ${workingDir}`);
    
    // Remove quotes if present (we don't need them for cwd)
    workingDir = workingDir.replace(/^["']|["']$/g, '');
    
    console.log(`[${action.id}] workingDir after quote removal: ${workingDir}`);
  } else {
    // Default: use directory (either the selected folder or the file's parent)
    workingDir = defaultWorkDir;
    console.log(`[${action.id}] Using defaultWorkDir: ${workingDir}`);
  }

  console.log(`[${action.id}] === Final Values ===`);
  console.log(`[${action.id}] Final command: ${finalCommand}`);
  console.log(`[${action.id}] Final workingDir: ${workingDir}`);
  console.log(`[${action.id}] Checking if workingDir exists...`);

  // Verify working directory exists
  if (!fs.existsSync(workingDir)) {
    console.error(`[${action.id}] Working directory does NOT exist: ${workingDir}`);
    vscode.window.showErrorMessage(`Working directory does not exist: ${workingDir}`);
    return;
  }

  console.log(`[${action.id}] Working directory exists: ${workingDir}`);

  try {
    if (showNotification) {
      vscode.window.showInformationMessage(`Executing: ${action.label}`);
    }

    // Execute command in background with explicit shell and environment
    const { stdout, stderr } = await execAsync(finalCommand, {
      cwd: workingDir,
      timeout: timeout,
      shell: process.env.SHELL || '/bin/bash',
      env: { ...process.env }
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
