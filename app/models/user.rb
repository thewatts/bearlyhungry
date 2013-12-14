class User < ActiveRecord::Base

  validates :full_name, presence: { message: "Please enter your full name." }
  validates :email, presence: true
  validates :password, :presence => {:on => :create}, :confirmation => true, 
    unless: :guest?

  validates :display_name, allow_blank: true, length: {
    in: 2..32,
    message: "Display name should be between 2 and 32 characters, please." }
  validates :email, uniqueness: true

  has_secure_password validations:false

  has_many :orders
  has_many :jobs
  has_many :restaurants, through: :jobs
  has_many :roles, through: :jobs

  after_create :send_welcome_email

  def admin?
    self.admin_status
  end

  def set_guest
    self.guest = true
  end

  def past_orders
    @orders.sort_by {|order| order.created_at}.reverse unless guest
  end

  def total_spent
    if @user
     @orders.completed.map(&:subtotal).reduce(:+) || 0
    end
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver
  end

  def owner_of?(restaurant)
    jobs.any? { |job| job.restaurant_id == restaurant.id }
  end

  def send_new_restaurant_confirmation_email
    ## NEED TO CHANGE THE EMAIL_DATA WHEN METHOD IS MOVED FROM USER TO RESTAURANT

    @email_data = {
      user_email: email,
      user_name: full_name,

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

  def self.find_and_authenticate(session_params)
    user = find_by(email: session_params[:email])
    if user && user.authenticate(session_params[:password])
      user
    end
  end
end
