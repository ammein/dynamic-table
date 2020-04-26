exports.command = function commitTable(){
    return this
        .clickWhenReady('[data-apos-workflow-commit]')
        .clickWhenReady('[data-apos-save]');
}