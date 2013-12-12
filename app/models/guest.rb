class Guest < UserBase

  before_create :set_guest


end
