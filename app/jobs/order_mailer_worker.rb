class OrderMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "order_mailer"

  def self.perform(email_data)
    OrderMailer.order_confirmation_email(email_data).deliver
  end

  # def self.perform(ready_confirmation)
  #   OrderMailer.order_ready_email(ready_confirmation).deliver
  # end
end
