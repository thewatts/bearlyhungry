class Guest < UserBase
  self.table_name = :users

  before_create :set_guest

  def set_guest
    self.guest = true
  end

end
