class UserBase < ActiveRecord::Base
  self.table_name = :users


  def current_order
    orders.last
  end

end

