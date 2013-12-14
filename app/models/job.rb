class Job < ActiveRecord::Base
  belongs_to :restaurant
  belongs_to :user
  belongs_to :role

  validates :user_id, :restaurant_id, :role_id, :presence => true

end
