class Restaurant < ActiveRecord::Base

  validates :name, :slug, uniqueness: true, presence: true

  has_many :items
  has_many :orders
  has_many :jobs
  has_many :users, through: :jobs

  belongs_to :city

  def self.create_with_owner(restaurant_params, user)
    restaurant = Restaurant.create!(restaurant_params)
    Job.create!(:restaurant => restaurant, :user => user, :role => Role.owner)
    restaurant
  end

  def add_owner(user)
    Job.create!(:restaurant => self, :user => user, :role => Role.owner)
  end

  def approved?
    status == "approved"
  end

  def valid_orders
    Order.valid.where("restaurant_id = ?", id)
  end

  def customers
    valid_orders.map(&:user).uniq ## ASK ABOUT THIS
  end
end
