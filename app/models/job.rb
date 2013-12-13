class Job < ActiveRecord::Base
  belongs_to :restaurant
  belongs_to :user
  belongs_to :role
end
