include ActionDispatch::TestProcess # for file upload testing

FactoryGirl.define do
  factory :item do
    title       "PHO"
    description "This is like.. PHOnaminal!"
    price       20.00
  end

  factory :user do
    full_name "Jerome Bartholomew"
    display_name "JB"
  end
end
