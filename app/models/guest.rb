class Guest < UserBase

  before_create :set_guest

  def set_guest
    self.guest = true
  end
end
