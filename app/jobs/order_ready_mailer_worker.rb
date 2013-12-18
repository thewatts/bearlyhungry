# class OrderReadyMailerWorker
#   include Sidekiq::Worker
#   sidekiq_options queue: "order_ready_mailer"

#   def self.perform(ready_confirmation)
#     OrderMailer.order_ready_email(@ready_confirmation).deliver
#   end
# end
