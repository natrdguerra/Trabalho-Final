import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'pages/public')));

const porta = 3000;
const host = 'localhost';

var listaUsuarios = [];
let mensagens = [];

function cadastrarUsuarioView(req, res) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Usuario</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Cadastro de Usuário</h1>
                <form id="formCadastro" action="/cadastrarUsuario" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="nome" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome" required>
                        <span class="text-danger" id="erronome"></span>
                    </div>
                    <div class="mb-3">
                        <label for="nascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="nascimento" name="nascimento" required>
                        <span class="text-danger" id="erronascimento"></span>
                    </div>
                    <div class="mb-3">
                        <label for="nickname" class="form-label">Nickname ou Apelido</label>
                        <input type="text" class="form-control" id="nickname" name="nickname" placeholder="Digite o seu nickname" required>
                        <span class="text-danger" id="erronickname"></span>
                    </div>
                    <button type="submit" class="btn btn-dark">Cadastrar Usuário</button>
                    <br><br>
                     <div class="mb-3">
                     ${mensagemUltimoLogin}
                     </div>
                </form>
            </div>
                        <script>
                document.getElementById('formCadastro').addEventListener('submit', function(event) {
                    let isValid = true;

                    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                    document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

                    if (!document.getElementById('nome').value.trim()) {
                        document.getElementById('erronome').textContent = 'O Nome é obrigatório.';
                        document.getElementById('nome').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('nascimento').value.trim()) {
                        document.getElementById('erronascimento').textContent = 'O nascimento é obrigatório.';
                        document.getElementById('nascimento').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('nickname').value.trim()) {
                        document.getElementById('erronickname').textContent = 'O nickname é obrigatório.';
                        document.getElementById('nickname').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!isValid) {
                        event.preventDefault();
                    }
                });
            </script>
        </body>
        </html>
    `);
}

function cadastrarUsuario(req, resp) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    const nome = req.body.nome;
    const nascimento = req.body.nascimento;
    const nickname = req.body.nickname;

    const usuario = { nome, nascimento, nickname };
    listaUsuarios.push(usuario);

    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Usuários</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Nascimento</th>
                    <th scope="col">Nickname</th>
                </tr>
            </thead>
            <tbody>`);

    for (let i = 0; i < listaUsuarios.length; i++) {
        resp.write(`
            <tr>
                <td>${listaUsuarios[i].nome}</td>
                <td>${listaUsuarios[i].nascimento}</td>
                <td>${listaUsuarios[i].nickname}</td>
            </tr>
        `);
    }

    resp.write(`
        </tbody>
        </table>
        <a class="btn btn-dark" href="/cadastrarUsuario" role="button">Continuar cadastrando</a>
        <a class="btn btn-dark" href="/" role="button">Voltar para o menu</a>
        <br><br>
        <div class="mb-3">
            ${mensagemUltimoLogin}
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </html>
    `);
    resp.end();
}

function menuView(req, resp) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Menu Principal</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuários</a>
        </li>
        <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="/enviarMensagem">Bate-Papo</a>
        </li>        
        <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
        </li>
      </ul>
     <div class="mb-3">
          ${mensagemUltimoLogin}
     </div>
    </div>
  </div>
</nav>
</body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html> `)
}

function exibirUltimoLogin(req) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (dataHoraUltimoLogin) {
        return `<p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>`;
    } else {
        return `<p><span>Este é seu primeiro acesso.</span></p>`;
    }
}

function exibirBatePapoView(req, res) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    const mensagensHTML = mensagens
        .map(
            (msg) => `
            <div class="mb-2">
                <strong>${msg.usuario}</strong>
                <small class="text-muted">(${msg.horario})</small>:
                <p>${msg.mensagem}</p>
            </div>
        `
        )
        .join('');

    const opcoesNicknames = listaUsuarios.map((usuario) => 
        `<option value="${usuario.nickname}">${usuario.nickname}</option>`
    ).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bate-Papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Bate-Papo</h1>
                <form id="formMensagem" action="/enviarMensagem" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="usuario" class="form-label">Escolha o Nickname</label>
                        <select class="form-control" id="usuario" name="usuario" required>
                            <option value="" disabled selected>Selecione um nickname</option>
                            ${opcoesNicknames}
                        </select>
                        <span class="text-danger" id="erroUsuario"></span>
                    </div>
                    <div class="mb-3">
                        <label for="mensagem" class="form-label">Mensagem</label>
                        <textarea class="form-control" id="mensagem" name="mensagem" rows="3" required></textarea>
                        <span class="text-danger" id="erroMensagem"></span>
                    </div>
                    <button type="submit" class="btn btn-dark">Enviar</button>
                </form>
                <div class="mt-4">
                    <h2>Mensagens</h2>
                    <div id="listaMensagens" class="border p-3 bg-light">
                        ${mensagensHTML}
                    </div>
                    <br>
                    <a class="btn btn-dark" href="/" role="button">Voltar para o menu</a>
                    <br><br>
                    <div class="mb-3">
                    ${mensagemUltimoLogin}
                    </div>
                </div>
            </div>
            
            <script>
             document.getElementById('formMensagem').addEventListener('submit', function(event) {
             let isValid = true;

             document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
             document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

             if (!document.getElementById('usuario').value.trim()) {
             document.getElementById('erroUsuario').textContent = 'O usuário é obrigatório.';
             document.getElementById('usuario').classList.add('is-invalid');
              isValid = false;
        }

             if (!document.getElementById('mensagem').value.trim()) {
             document.getElementById('erroMensagem').textContent = 'A mensagem não pode ser vazia.';
             document.getElementById('mensagem').classList.add('is-invalid');
             isValid = false;
        }

        // Se não for válido, impede o envio do formulário
             if (!isValid) {
             event.preventDefault();
         }
      });
            </script>
        </body>
        </html>
    `);
}

app.post('/enviarMensagem', verificarAutenticacao, (req, res) => {
    const { usuario, mensagem } = req.body;
    const horario = new Date().toLocaleString();

    if (usuario && mensagem) {
        mensagens.push({ usuario, mensagem, horario });
    }
    res.redirect('/enviarMensagem');
});

function autenticarUsuario(req, resp) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    console.log("Usuário enviado:", usuario);
    console.log("Senha enviada:", senha);

    if (usuario === 'admin' && senha === '123') {
        console.log("Autenticação bem-sucedida");
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/');
    } else {
        console.log("Autenticação falhou");
        resp.send(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container w-25"> 
                        </br>
                        <div class="alert alert-danger" role="alert">
                            Usuário ou senha inválidos!
                        </div>
                        <div>
                            <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
}

function verificarAutenticacao(req, resp, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        resp.redirect('/login.html');
    }
}

app.get('/login', (req, resp) =>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy(); 
    resp.redirect('/login.html');
});

app.post('/login', autenticarUsuario);
app.get('/',verificarAutenticacao,menuView);
app.get('/cadastrarUsuario', verificarAutenticacao,cadastrarUsuarioView);
app.get('/enviarMensagem', verificarAutenticacao, exibirBatePapoView);
app.get('/batePapo', verificarAutenticacao);
app.post('/cadastrarUsuario', verificarAutenticacao, cadastrarUsuario);
app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});