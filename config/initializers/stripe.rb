Rails.configuration.stripe = {
  :publishable_key => 'pk_test_FkZhJFpPfgXkg7OQTxzHxXEK',
  :secret_key      => 'sk_test_2MGndBd38WT9XdCKGEZNJg5z'
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
