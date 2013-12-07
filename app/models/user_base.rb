class UserBase < ActiveRecord::Base
  self.table_name = :users

  validates :full_name, presence: { message: "Please enter your full name." }
  validates :email, presence: true

  has_many :orders


  def current_order
    orders.last
  end

end


class Guest < UserBase
  self.table_name = :users

  before_create :set_guest

  def set_guest
    self.guest = true
  end


end
