class User < ActiveRecord::Base
  validates :full_name, presence: true, { message: "Please enter your full name."}

  validates :display_name, allow_blanklength: { in: 2..32 }, allow_blank: true, {message: "Display name should be between 2 and 32 characters, please."}
end
