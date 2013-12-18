class OrderMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "order_mailer"

  def self.perform(email_data)
    OrderMailer.order_confirmation_email(email_data).deliver
  end

#  def self.perform(order_id)
#
#    OrderMailer.order_confirmation_email(data_for(order_id)).deliver
#  end
#
#  def self.data_for(order_id)
#    o = Order.find_by(order_id)
#    
#  end
#
  # def self.perform(ready_confirmation)
  #   OrderMailer.order_ready_email(ready_confirmation).deliver
  # end
end
