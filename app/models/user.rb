class User < ActiveRecord::Base
  validates :full_name, presence: { message: "Please enter your full name." }
  validates :display_name, allow_blank: true, length: { in: 2..32, message: "Display name should be between 2 and 32 characters, please." }
end
