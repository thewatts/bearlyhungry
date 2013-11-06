class User < ActiveRecord::Base
  validates :full_name, presence: true
  validates :display_name, length: { in: 2..32 }, allow_blank: true
end
