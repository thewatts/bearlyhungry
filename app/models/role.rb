class Role < ActiveRecord::Base

  has_many :jobs
  has_many :users,       through: :jobs
  has_many :restaurants, through: :jobs

  def self.owner
    find_by(name: "Owner")
  end

  def self.stocker
    find_by(name: "Stocker")
  end

  def self.cook
    find_by(name: "Cook")
  end
end
