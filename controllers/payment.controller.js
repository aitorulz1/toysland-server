const stripe = reuquire('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports.payment = (req, res, next) => {
    stripe.charges.create({
        amount: req.body.amount * 100,
        description: 'payment',
        current: 'EUR',
        source: req.body.id,
        receipt_email: req.body.email
    })
    .then(charge => {
        res.json({OK: true})
    })
    .catch(next)
}