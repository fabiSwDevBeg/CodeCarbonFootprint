import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('python');

    let disposable = vscode.commands.registerCommand('extension.checkForLoops', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const lines = text.split('\n');

            let diagnostics: vscode.Diagnostic[] = [];

            lines.forEach((line, index) => {
                if (line.includes('for') && line.includes('in range(')) {
                    const rangeMatch = line.match(/range\(([^)]+)\)/);
                    if (rangeMatch) {
                        const rangeArgs = rangeMatch[1].split(',').map(arg => arg.trim());
                        let rangeLength = 0;

                        if (rangeArgs.length === 1) {
                            rangeLength = parseInt(rangeArgs[0], 10);
                        } else if (rangeArgs.length === 2) {
                            rangeLength = parseInt(rangeArgs[1], 10) - parseInt(rangeArgs[0], 10);
                        } else if (rangeArgs.length === 3) {
                            rangeLength = Math.floor((parseInt(rangeArgs[1], 10) - parseInt(rangeArgs[0], 10)) / parseInt(rangeArgs[2], 10));
                        }

                        if (rangeLength > 50) {
                            const startPos = new vscode.Position(index, 0);
                            const endPos = new vscode.Position(index, line.length);
                            const range = new vscode.Range(startPos, endPos);
                            const diagnostic = new vscode.Diagnostic(range, `Range length is ${rangeLength}, which is greater than 50`, vscode.DiagnosticSeverity.Warning);
                            diagnostics.push(diagnostic);
                        }
                    }
                }
            });

            diagnosticCollection.set(document.uri, diagnostics);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
