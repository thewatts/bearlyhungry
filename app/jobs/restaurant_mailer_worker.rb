class RestaurantMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "restaurant_mailer"

  def self.perform(email_data)
    RestaurantMailer.new_restaurant_confirmation_email(@email_data).deliver
  end

end
