class Restaurant < ActiveRecord::Base

  validates :name, :slug, uniqueness: true, presence: true

  has_many :items
  has_many :orders
  has_many :jobs
  has_many :users, through: :jobs

  def self.create_with_owner(restaurant_params, user)
    restaurant = Restaurant.create!(restaurant_params)
    Job.create!(:restaurant => restaurant, :user => user, :role => Role.owner)
    send_new_restaurant_confirmation_email(user)
    restaurant
  end

  def approved?
    status == "approved"
  end

  def send_new_restaurant_confirmation_email(user)
    ## NEED TO CHANGE THE EMAIL_DATA WHEN METHOD IS MOVED FROM USER TO RESTAURANT

    @email_data = {
      user_email: user.email,
      user_name: user.full_name,

    }
    RestaurantMailer.new_restaurant_confirmation_email(@email_data).deliver
  end

  def send_new_restaurant_rejection_email
    ## NEED TO CHANGE THE EMAIL_DATA WHEN METHOD IS MOVED FROM USER TO RESTAURANT

    @email_data = {
      user_email: email,
      user_name: full_name,

    }
    RestaurantMailer.new_restaurant_rejection_email(@email_data).deliver
  end

  def send_new_restaurant_approval_email
        ## NEED TO CHANGE THE EMAIL_DATA WHEN METHOD IS MOVED FROM USER TO RESTAURANT

    @email_data = {
      user_email: email,
      user_name: full_name,

    }
    RestaurantMailer.new_restaurant_approval_email(@email_data).deliver
  end
end
