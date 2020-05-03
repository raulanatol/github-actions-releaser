module.exports = {
    groupBy: {
        '🐛 Bug Fixes': ['bug'],
        '🚀 Features': ['enhancement']
    },
    template: {
        noLabel: "closed",
        group: "\n{{heading}}\n--\n",
        release: '{{body}}',
        changelogTitle: '# What\'s changed\n',
        releaseSeparator: "",
        issue: function (placeholders) {
            return '- ' + placeholders.name + ' ([' + placeholders.text + '](' + placeholders.url + ')) @' + placeholders.user_login;
        },
    }
}
