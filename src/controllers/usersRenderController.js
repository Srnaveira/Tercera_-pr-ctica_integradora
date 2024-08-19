
async function renderLogin (req, res) {
    try {

        res.status(200).render('login');
    } catch (error) {
        req.logger.error("Problemas renderizando login")
        res.statu(404).json({message: "Problemas renderizando login"})
    }
}

async function renderRegister (req, res) {
    try {
        res.status(200).render('register');
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderProfile (req, res) {
    try {
        res.status(200).render('current', { user: req.session.user });;
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderUser (req, res) {
    try {
        res.status(200).json(req.session.user || null);
    } catch (error) {
        req.logger.error("Problemas renderizando user")
        res.statu(404).json({message: "Problemas renderizando user"})
    }
}

async function renderRecuperarPassword (req, res) {
    try {
        req.logger.info('Rendering requestpassword view');
        res.status(200).render('requestpassword');
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderResetPassword(req, res) {
    try {
        const { token } = req.query;
        res.status(200).render('resetpassword', { token });
    } catch (error) {
        req.logger.error("Problemas renderizando resetpassword");
        res.status(404).json({ message: "Problemas renderizando resetpassword" });
    }
}

module.exports = {
    renderLogin,
    renderProfile,
    renderRegister,
    renderUser,
    renderRecuperarPassword,
    renderResetPassword
}