import * as vscode from 'vscode';

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

export class SettingsWebviewProvider {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  public show() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'actionsForVscodeSettings',
      'Actions For VSCode Settings',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.iconPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      'resources',
      'icon.png'
    );

    this.panel.webview.html = this.getHtmlContent();

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'load':
            await this.sendActionsToWebview();
            break;
          case 'save':
            await this.saveActions(message.actions);
            break;
          case 'add':
            await this.addAction(message.action);
            break;
          case 'delete':
            await this.deleteAction(message.id);
            break;
          case 'update':
            await this.updateAction(message.action);
            break;
        }
      },
      undefined,
      this.context.subscriptions
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    // Send initial data
    this.sendActionsToWebview();
  }

  private async sendActionsToWebview() {
    if (!this.panel) {
      return;
    }

    const config = vscode.workspace.getConfiguration('actionsForVscode');
    const actions = config.get<CustomAction[]>('actions', []);

    this.panel.webview.postMessage({
      command: 'actionsLoaded',
      actions: actions
    });
  }

  private async saveActions(actions: CustomAction[]) {
    const config = vscode.workspace.getConfiguration('actionsForVscode');
    
    try {
      await config.update('actions', actions, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('Actions saved successfully!');
      
      if (this.panel) {
        this.panel.webview.postMessage({ command: 'saveDone' });
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to save actions: ${error.message}`);
    }
  }

  private async addAction(action: CustomAction) {
    const config = vscode.workspace.getConfiguration('actionsForVscode');
    const actions = config.get<CustomAction[]>('actions', []);
    
    // Check for duplicate ID
    if (actions.some(a => a.id === action.id)) {
      vscode.window.showErrorMessage(`Action with ID "${action.id}" already exists!`);
      return;
    }

    actions.push(action);
    await this.saveActions(actions);
    await this.sendActionsToWebview();
  }

  private async deleteAction(id: string) {
    const config = vscode.workspace.getConfiguration('actionsForVscode');
    const actions = config.get<CustomAction[]>('actions', []);
    
    const filtered = actions.filter(a => a.id !== id);
    await this.saveActions(filtered);
    await this.sendActionsToWebview();
  }

  private async updateAction(updatedAction: CustomAction) {
    const config = vscode.workspace.getConfiguration('actionsForVscode');
    const actions = config.get<CustomAction[]>('actions', []);
    
    const index = actions.findIndex(a => a.id === updatedAction.id);
    if (index === -1) {
      vscode.window.showErrorMessage(`Action with ID "${updatedAction.id}" not found!`);
      return;
    }

    actions[index] = updatedAction;
    await this.saveActions(actions);
    await this.sendActionsToWebview();
  }

  private getHtmlContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actions For VSCode Settings</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
      margin: 0;
    }
    h1 {
      color: var(--vscode-foreground);
      border-bottom: 1px solid var(--vscode-panel-border);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .btn {
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 2px;
      font-size: 13px;
    }
    .btn:hover {
      background-color: var(--vscode-button-hoverBackground);
    }
    .btn-secondary {
      background-color: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .btn-secondary:hover {
      background-color: var(--vscode-button-secondaryHoverBackground);
    }
    .btn-danger {
      background-color: #d73a49;
      color: white;
    }
    .btn-danger:hover {
      background-color: #cb2431;
    }
    .btn-small {
      padding: 4px 8px;
      font-size: 12px;
      margin-left: 4px;
    }
    .action-card {
      background-color: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .action-card.disabled {
      opacity: 0.6;
    }
    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .action-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--vscode-foreground);
    }
    .action-id {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      margin-left: 8px;
    }
    .action-buttons {
      display: flex;
      gap: 4px;
    }
    .action-field {
      margin-bottom: 8px;
      display: flex;
      gap: 8px;
    }
    .action-field label {
      min-width: 120px;
      color: var(--vscode-descriptionForeground);
      font-size: 13px;
    }
    .action-field span {
      color: var(--vscode-foreground);
      font-family: var(--vscode-editor-font-family);
    }
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-content {
      background-color: var(--vscode-editor-background);
      margin: 5% auto;
      padding: 20px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      width: 80%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--vscode-panel-border);
      padding-bottom: 10px;
    }
    .modal-header h2 {
      margin: 0;
      color: var(--vscode-foreground);
    }
    .close {
      color: var(--vscode-foreground);
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
      line-height: 1;
    }
    .close:hover {
      color: var(--vscode-errorForeground);
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      margin-bottom: 4px;
      color: var(--vscode-foreground);
      font-size: 13px;
    }
    .form-group small {
      display: block;
      margin-top: 2px;
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
    }
    input[type="text"],
    textarea,
    select {
      width: 100%;
      padding: 6px 8px;
      background-color: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 2px;
      font-family: var(--vscode-editor-font-family);
      font-size: 13px;
    }
    input[type="text"]:focus,
    textarea:focus,
    select:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }
    input[type="checkbox"] {
      margin-right: 8px;
    }
    .checkbox-group {
      display: flex;
      gap: 16px;
      margin-top: 4px;
    }
    .checkbox-item {
      display: flex;
      align-items: center;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--vscode-descriptionForeground);
    }
    .empty-state p {
      margin-bottom: 16px;
    }
    .error {
      color: var(--vscode-errorForeground);
      font-size: 12px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Actions For VSCode Settings</h1>
    <button class="btn" onclick="showAddModal()">+ Add New Action</button>
  </div>

  <div id="actions-list"></div>

  <!-- Add/Edit Modal -->
  <div id="actionModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modalTitle">Add New Action</h2>
        <button class="close" onclick="closeModal()">&times;</button>
      </div>
      
      <form id="actionForm" onsubmit="return false;">
        <input type="hidden" id="editingId" value="">
        
        <div class="form-group">
          <label for="actionId">ID *</label>
          <input type="text" id="actionId" required pattern="[a-zA-Z0-9_-]+" placeholder="e.g., openOrigin">
          <small>Unique identifier (alphanumeric, hyphens, underscores only)</small>
          <div id="idError" class="error"></div>
        </div>

        <div class="form-group">
          <label for="actionLabel">Label *</label>
          <input type="text" id="actionLabel" required placeholder="e.g., Open Git Origin">
          <small>Text shown in the context menu</small>
        </div>

        <div class="form-group">
          <label for="actionCommand">Command *</label>
          <textarea id="actionCommand" required rows="3" placeholder="e.g., git log {path}"></textarea>
          <small>Use placeholders: {path}, {file}, {files}, {dir}, {workspace}</small>
        </div>

        <div class="form-group">
          <label for="actionCwd">Working Directory</label>
          <input type="text" id="actionCwd" placeholder="e.g., {dir} or {workspace}">
          <small>Optional. Defaults to parent directory for files, the folder itself for folders</small>
        </div>

        <div class="form-group">
          <label>Contexts *</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input type="checkbox" id="contextExplorer" value="explorer" checked>
              <label for="contextExplorer">Explorer</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="contextScm" value="scm">
              <label for="contextScm">SCM</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="contextEditor" value="editor">
              <label for="contextEditor">Editor</label>
            </div>
          </div>
          <small>Where to show this action</small>
        </div>

        <div class="form-group">
          <label for="actionIcon">Icon</label>
          <input type="text" id="actionIcon" placeholder="e.g., link-external">
          <small>VS Code icon ID (optional) - <a href="https://code.visualstudio.com/api/references/icons-in-labels" style="color: var(--vscode-textLink-foreground)">Icon Reference</a></small>
        </div>

        <div class="form-group">
          <div class="checkbox-item">
            <input type="checkbox" id="actionShowNotification" checked>
            <label for="actionShowNotification">Show notifications</label>
          </div>
        </div>

        <div class="form-group">
          <div class="checkbox-item">
            <input type="checkbox" id="actionEnabled" checked>
            <label for="actionEnabled">Enabled</label>
          </div>
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn" onclick="saveAction()">Save Action</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let actions = [];

    // Request initial data
    vscode.postMessage({ command: 'load' });

    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      
      switch (message.command) {
        case 'actionsLoaded':
          actions = message.actions || [];
          renderActions();
          break;
        case 'saveDone':
          closeModal();
          break;
      }
    });

    function renderActions() {
      const list = document.getElementById('actions-list');
      
      if (actions.length === 0) {
        list.innerHTML = \`
          <div class="empty-state">
            <p>No actions configured yet.</p>
            <button class="btn" onclick="showAddModal()">+ Add Your First Action</button>
          </div>
        \`;
        return;
      }

      list.innerHTML = actions.map(action => \`
        <div class="action-card \${action.enabled === false ? 'disabled' : ''}">
          <div class="action-header">
            <div>
              <span class="action-title">\${escapeHtml(action.label)}</span>
              <span class="action-id">(\${escapeHtml(action.id)})</span>
            </div>
            <div class="action-buttons">
              <button class="btn btn-small btn-secondary" onclick="editAction('\${escapeHtml(action.id)}')">Edit</button>
              <button class="btn btn-small btn-danger" onclick="deleteAction('\${escapeHtml(action.id)}')">Delete</button>
            </div>
          </div>
          <div class="action-field">
            <label>Command:</label>
            <span>\${escapeHtml(action.command)}</span>
          </div>
          \${action.cwd ? \`
            <div class="action-field">
              <label>Working Directory:</label>
              <span>\${escapeHtml(action.cwd)}</span>
            </div>
          \` : ''}
          <div class="action-field">
            <label>Contexts:</label>
            <span>\${(action.contexts || ['explorer']).join(', ')}</span>
          </div>
          \${action.icon ? \`
            <div class="action-field">
              <label>Icon:</label>
              <span>\${escapeHtml(action.icon)}</span>
            </div>
          \` : ''}
          <div class="action-field">
            <label>Status:</label>
            <span>\${action.enabled !== false ? 'Enabled' : 'Disabled'} | Notifications: \${action.showNotification !== false ? 'On' : 'Off'}</span>
          </div>
        </div>
      \`).join('');
    }

    function showAddModal() {
      document.getElementById('modalTitle').textContent = 'Add New Action';
      document.getElementById('actionForm').reset();
      document.getElementById('editingId').value = '';
      document.getElementById('contextExplorer').checked = true;
      document.getElementById('actionShowNotification').checked = true;
      document.getElementById('actionEnabled').checked = true;
      document.getElementById('idError').textContent = '';
      document.getElementById('actionModal').style.display = 'block';
    }

    function editAction(id) {
      const action = actions.find(a => a.id === id);
      if (!action) return;

      document.getElementById('modalTitle').textContent = 'Edit Action';
      document.getElementById('editingId').value = action.id;
      document.getElementById('actionId').value = action.id;
      document.getElementById('actionId').disabled = true; // Can't change ID
      document.getElementById('actionLabel').value = action.label;
      document.getElementById('actionCommand').value = action.command;
      document.getElementById('actionCwd').value = action.cwd || '';
      document.getElementById('actionIcon').value = action.icon || '';
      
      const contexts = action.contexts || ['explorer'];
      document.getElementById('contextExplorer').checked = contexts.includes('explorer');
      document.getElementById('contextScm').checked = contexts.includes('scm');
      document.getElementById('contextEditor').checked = contexts.includes('editor');
      
      document.getElementById('actionShowNotification').checked = action.showNotification !== false;
      document.getElementById('actionEnabled').checked = action.enabled !== false;
      document.getElementById('idError').textContent = '';
      
      document.getElementById('actionModal').style.display = 'block';
    }

    function closeModal() {
      document.getElementById('actionModal').style.display = 'none';
      document.getElementById('actionId').disabled = false;
    }

    function saveAction() {
      const editingId = document.getElementById('editingId').value;
      const id = document.getElementById('actionId').value.trim();
      const label = document.getElementById('actionLabel').value.trim();
      const command = document.getElementById('actionCommand').value.trim();
      const cwd = document.getElementById('actionCwd').value.trim();
      const icon = document.getElementById('actionIcon').value.trim();
      
      // Validate ID
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        document.getElementById('idError').textContent = 'ID must contain only alphanumeric characters, hyphens, and underscores';
        return;
      }

      // Check for duplicate ID (only when adding new)
      if (!editingId && actions.some(a => a.id === id)) {
        document.getElementById('idError').textContent = 'An action with this ID already exists';
        return;
      }

      // Validate required fields
      if (!id || !label || !command) {
        alert('Please fill in all required fields (ID, Label, Command)');
        return;
      }

      // Get selected contexts
      const contexts = [];
      if (document.getElementById('contextExplorer').checked) contexts.push('explorer');
      if (document.getElementById('contextScm').checked) contexts.push('scm');
      if (document.getElementById('contextEditor').checked) contexts.push('editor');

      if (contexts.length === 0) {
        alert('Please select at least one context');
        return;
      }

      const action = {
        id,
        label,
        command,
        contexts,
        showNotification: document.getElementById('actionShowNotification').checked,
        enabled: document.getElementById('actionEnabled').checked
      };

      if (cwd) action.cwd = cwd;
      if (icon) action.icon = icon;

      if (editingId) {
        // Update existing action
        vscode.postMessage({ command: 'update', action });
      } else {
        // Add new action
        vscode.postMessage({ command: 'add', action });
      }
    }

    function deleteAction(id) {
      const action = actions.find(a => a.id === id);
      if (!action) return;

      if (confirm(\`Are you sure you want to delete the action "\${action.label}"?\`)) {
        vscode.postMessage({ command: 'delete', id });
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
      const modal = document.getElementById('actionModal');
      if (event.target === modal) {
        closeModal();
      }
    };
  </script>
</body>
</html>`;
  }
}
