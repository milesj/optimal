# Optimal
[![Build Status](https://travis-ci.org/milesj/optimal.svg?branch=master)](https://travis-ci.org/milesj/optimal)

Optimal, a system for building and validating options and configuration objects.

* Recursively builds and validates nested structures
* Supports common data types
* Autofills missing fields with default values
* Allows or restricts unknown fields
* Mark fields as nullable or required
* Utilize complex operators like AND, OR, and XOR

## Documentation

* [Options Class](#options-class)
  * [Blueprint](#predicate-blueprint)
  * [Customization](#customization)
* [Predicates](#predicates)
  * [Array](#array)
  * [Bool](#bool)
  * [Custom](#custom)
  * [Date](#date)
  * [Function](#func)
  * [Instance](#instance)
  * [Number](#number)
  * [Object](#object)
  * [Regex](#regex)
  * [Shape](#shape)
  * [String](#string)
  * [Union](#union)

### Options Class

The core of Optimal is the `Options` class. It accepts a

#### Blueprint

### Predicates

#### Array

The `array` function will
