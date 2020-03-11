module.exports = (hbs) => {

hbs.registerHelper('isSession', (id, user, options) => {
    const userID = id.id
    const currentId = user.id
    const userBool = userId === currentId
    return !userBool ? new hbs.SafeString(options.fn(this)) : new hbs.SafeString(options.inverse(this));
})

hbs.registerHelper = (user, options) => {
    const likeBool = user.like.some(userLike => userLike.id === likes.id);
    return likeBool ? new hbs.SafeString(option.fn(this)) : new hbs.SafeString(option.inverse(this));
}

}