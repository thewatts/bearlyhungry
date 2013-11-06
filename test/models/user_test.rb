require 'test_helper'

class UserTest < ActiveSupport::TestCase

    test "user must exist" do
      user = FactoryGirl.build(:user, full_name: "")
      refute user.save
    end

    test "user must have full name which is not blank" do
      user1 = FactoryGirl.build(:user, full_name: "")
      user2 = FactoryGirl.build(:user, full_name: "Jerome Bartholomew")

      refute user1.save
      assert user2.save

    end

    test "user may have display name 32 > size > 2" do
      user1 = FactoryGirl.build(:user, display_name: "")
      user2 = FactoryGirl.build(:user, display_name: "A")
      user3 = FactoryGirl.build(:user, display_name: "asdfghjklqwertyuiopzxcvbnmasdfghj")
      user4 = FactoryGirl.build(:user, display_name: "Squeaky")

      assert user1.save #should still save if no display_name
      refute user2.save
      refute user3.save
      assert user4.save
    end

end
