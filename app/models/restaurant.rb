class Restaurant < ActiveRecord::Base

  validates :name, :slug, uniqueness: true, presence: true

  has_many :items
  has_many :orders
  has_many :jobs
  has_many :users, through: :jobs

  def self.create_with_owner(restaurant_params, user)
    restaurant = Restaurant.create!(restaurant_params)
    Job.create!(:restaurant => restaurant, :user => user, :role => Role.owner)
    restaurant
  end

  def approved?
    status == "approved"
  end
end
