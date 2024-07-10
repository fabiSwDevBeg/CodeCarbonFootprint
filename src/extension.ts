import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.calculateEnergyImpact', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const energyImpact = calculateEnergyImpact(text);
            vscode.window.showInformationMessage(`Energy Impact: ${energyImpact} units`);
        }
    });

    context.subscriptions.push(disposable);

    vscode.debug.onDidChangeActiveDebugSession(event => {
        if (event && event.type === 'started') {
            const session = vscode.debug.activeDebugSession;
            if (session) {
                session.customRequest('variables', { variablesReference: 1 }).then(response => {
                    const variables = response.body.variables;
					// @ts-ignore
                    variables.forEach(variable => {
                        console.log(variable.name, variable.value);
                    });
                });
            }
        }
    });
}

function calculateEnergyImpact(code: string): number {
    let impact = 0;
    const lines = code.split('\n');
    lines.forEach(line => {
        if (line.includes('if')) {
            impact += 1; // Peso arbitrario per una condizione if
        }
        if (line.includes('for') || line.includes('while')) {
            impact += 2; // Peso arbitrario per un ciclo
        }
    });
    return impact;
}

export function deactivate() {}
