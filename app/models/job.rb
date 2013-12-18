class Job < ActiveRecord::Base
  belongs_to :restaurant
  belongs_to :user
  belongs_to :role

  validates :user_id, :restaurant_id, :role_id, :presence => true

  def self.is_owner
    includes(:role).where("roles.name = 'Owner'").references(:roles)
  end
end
