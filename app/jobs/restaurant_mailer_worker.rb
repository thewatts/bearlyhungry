class RestaurantMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "restaurant_mailer"

  def self.perform(restaurant_id)
    restaurant = Restaurant.find_by_id(user_id)
    RestaurantMailer.new_restaurant_submitted_email(@email_data).deliver
  end

end
