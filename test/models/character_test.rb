require "test_helper"

class CharacterTest < ActiveSupport::TestCase
  test "#as_json returns only name, id, and image_url" do
    character_one = characters(:one)
    character_keys = character_one.as_json.keys
    assert_equal character_keys.sort, ["name", "id", "image_url"].sort
  end
end
