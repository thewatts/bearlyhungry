class Role < ActiveRecord::Base
  has_many :jobs
  has_many :users, through: :jobs
  has_many :restaurants, through: :jobs

  def self.owner
    find_by(name: "Owner")
  end
end
