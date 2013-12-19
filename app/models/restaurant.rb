class Restaurant < ActiveRecord::Base

  validates :name, :slug, uniqueness: true, presence: true

  has_many :items
  has_many :orders
  has_many :jobs
  has_many :users, through: :jobs

  belongs_to :city

  def self.create_with_owner(restaurant_params, user)
    restaurant = Restaurant.create!(restaurant_params)
    Job.create(:restaurant => restaurant, :user => user, :role => Role.owner)
    restaurant.send_new_restaurant_confirmation_email(user)
    restaurant.send_new_restaurant_submitted_email
    restaurant
  end

  def owners
    jobs.is_owner.collect{|job| job.user}
  end

  def add_owner(user)
    Job.create!(:restaurant => self, :user => user, :role => Role.owner)
  end

  def add_stocker(user)
    Job.create!(:restaurant => self, :user => user, :role => Role.stocker)
  end

  def add_cook(user)
    Job.create!(:restaurant => self, :user => user, :role => Role.cook)
  end

  def approved?
    status == "approved"
  end

  def valid_orders
    Order.valid.where("restaurant_id = ?", id)
  end

  def customers
    valid_orders.map(&:user).uniq ## ASK ABOUT THIS

    # SELECT DISTINCT USERS
  end

  def find_customer(id)
    valid_orders.where("user_id = ?", id).limit(1).first.user
  end

  def categories
    items.map { |item| item.categories[0] }.uniq
  end

  def items_for_category(category)
    category.items.where("items.restaurant_id = ?", id)
  end

  def send_new_restaurant_confirmation_email
    @owner_emails = owners.collect{|owner| owner.email}
    @owner_emails.each do |email|
      #TOOK OUT WORKER TO MAKE TEST PASS!
      RestaurantMailer.new_restaurant_confirmation_email(email).deliver
    end
  end

def send_new_restaurant_rejection_email
  @owner_emails = owners.collect{|owner| owner.email}

  @owner_emails.each do |email|
    RestaurantMailer.new_restaurant_rejection_email(email).deliver
  end
end

def send_new_restaurant_approval_email
  @owner_emails = owners.collect{|owner| owner.email}

  @owner_emails.each do |email|
    RestaurantMailer.new_restaurant_approval_email(email).deliver
  end
end

def send_new_restaurant_submitted_email
  @admin = User.find_by(:admin_status => true)
  @email_data = {
    admin_email: @admin.email
  }
  RestaurantMailer.new_restaurant_submitted_email(@email_data).deliver
end

def email_response
  if status == "Approved"
    send_new_restaurant_approval_email
  else
    send_new_restaurant_rejection_email
  end
end

end
