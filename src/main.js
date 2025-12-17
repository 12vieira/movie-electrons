// Importa os módulos principais do Electron
const { app, BrowserWindow, nativeTheme, Menu, shell } = require("electron");
const path = require("path"); // Boa prática para manipular caminhos

// -------------------------------------------------------
// TEMPLATE DO MENU (precisa vir antes do createWindow)
// -------------------------------------------------------
const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Sair',
                    click: () => {
                        app.quit();
                    },
                    accelerator: 'Alt+F4'
                }
            ]
        },
        {
            label: 'Exibir',
            submenu: [
                {
                    label: 'Recarregar',
                    role: 'reload'  
                },
                {
                    label: 'Ferramentas de Desenvolvedor',
                    role: 'toggleDevTools'
                },
                {
                    label: 'Alternar Tela Cheia',
                    role: 'toggleFullscreen'
                }
            ]
        },
        {
            label: 'Visualizar',
            submenu: [
                {
                    label: 'Zoom In',
                    role: 'zoomIn'
                },
                {
                    label: 'Reset Zoom',
                    role: 'resetZoom'
                },
                {
                    label: 'Zoom Out',
                    role: 'zoomOut'
                }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        ipcMain.emit('abrir-janela-sobre');
                    }
                },
                {
                    type: 'separator'
                },
                {
                label: 'Documentação',
                click: () => {
                    shell.openExternal('https://www.electronjs.org/docs/latest/');
                }
            }
            ]
        }
    ];


// -------------------------------------------------------
// Função principal que cria a janela do app
// -------------------------------------------------------
function createWindow() {

  // Força o tema escuro no aplicativo inteiro
  nativeTheme.themeSource = "dark";

  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      nodeIntegration: true,   // Permite usar require no front
      contextIsolation: false, // Necessário quando nodeIntegration está ativo
    },
  });

  // Aplica o menu no aplicativo
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Carrega o arquivo HTML principal da pasta src/app
  win.loadFile(path.join(__dirname, "app", "index.html"));
}


// -------------------------------------------------------
// Quando o Electron estiver pronto, cria a janela
// -------------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  // ✔ Correção do nome do evento (era "activite")
  app.on("activate", () => {
    // No macOS, recria a janela se todas forem fechadas
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


// -------------------------------------------------------
// Fecha o app totalmente quando todas as janelas fecharem
// (exceto no macOS)
// -------------------------------------------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});