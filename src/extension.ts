import * as vscode from 'vscode';

function getEndOfLineString(doc: vscode.TextDocument)
{
	switch (doc.eol) {
		case vscode.EndOfLine.CRLF:
			return "\r\n";
		case vscode.EndOfLine.LF:
			return "\n";
	}
}

export function activate(context: vscode.ExtensionContext) {
	let copyCommand = vscode.commands.registerCommand('copyforpowerpoint.copy', () => {
		let editor = vscode.window.activeTextEditor;
		if(editor === undefined) {
			return;
		}
		
		editor.edit((editBuilder: vscode.TextEditorEdit) => {
			let editor = vscode.window.activeTextEditor;
			if(editor === undefined) {
				return;
			}
			let text = editor.document.getText(new vscode.Range(editor.selection.start, editor.selection.end));
			let eol = getEndOfLineString(editor.document);
			editBuilder.replace(editor.selection, text.replace(new RegExp(eol, 'g'), '\v'));
		}) 
		.then(() => vscode.commands.executeCommand("editor.action.clipboardCopyAction"))
		.then(() => vscode.commands.executeCommand("undo"));
	});

	context.subscriptions.push(copyCommand);
}

export function deactivate() {}
