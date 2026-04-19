Feature: Player discovery search
  As a player
  I want to search for other players by name and filters
  So that I can find compatible teammates

  Scenario: Player searches by username and region filter
    Given players exist with different regions
    When a user searches for players with region "NA"
    Then only players from region "NA" are returned
