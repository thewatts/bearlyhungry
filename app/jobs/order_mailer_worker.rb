class OrderMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "order_mailer"

  def self.perform(order_id)
    user = User.find_by_id(user_id)
    OrderMailer.welcome_email(user).deliver
  end

end
