module.exports = function(app, loanController) {
    app.route('/loans')
        .get(loanController.getAll.bind(loanController))
        .post(loanController.create.bind(loanController))

    app.route('/loans/:loanId')
        .get(loanController.get.bind(loanController))
        .put(loanController.update.bind(loanController))
        .delete(loanController.delete.bind(loanController))
}
