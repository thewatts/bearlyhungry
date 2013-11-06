require 'test_helper'

class UserTest < ActiveSupport::TestCase

    test "user must exist" do
      user = User.new
      refute user.save
    end

    test "user must have valid/uniq email" do
      user1 = User.new(email: "a@a.com").save
      user2 = User.new(email: "a@a.com")

      refute item2.save, "User shouldn't save with dup email"
    end

    test "user must have full name which is not blank" do
      user1 = User.new(first_name: "", last_name: "")
      user2 = User.new(first_name: "Bob", last_name: "")
      user3 = User.new(first_name: "", last_name: "Smith")
      user4 = User.new(first_name: "Bob", last_name: "Smith")

      refute user1.save
      refute user2.save
      refute user3.save
      assert user4.save
    end

    test "user may have display name 32 > size > 2" do
      user1 = User.new(display_name: "")
      user2 = User.new(display_name: "A")
      user3 = User.new(display_name: "asdfghjklqwertyuiopzxcvbnmasdfghj")
      user4 = User.new(display_name: "Squeaky")

      assert user1.save
      refute user2.save
      refute user3.save
      assert user4.save
    end

end
