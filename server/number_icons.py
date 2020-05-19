zeroes = [
    [False, False, True, False, False, False, True, False],
    [False, True, True, True, False, True, True, True],
    [False, True, False, True, False, True, False, True],
    [False, False, True, False, False, False, True, False]
]

ones = [[False, True, True, False, False, True, True, False], [False, False, True, False, False, False, True, False], [
    False, False, True, False, False, False, True, False], [False, True, True, True, False, True, True, True]]

twos = [[False, True, True, False, False, True, True, False], [False, False, False, True, False, False, False, True], [
    False, False, True, False, False, False, True, False], [False, True, True, True, False, True, True, True]]

threes = [[False, True, True, False, False, True, True, False], [False, False, True, True, False, False, True, True], [
    False, False, False, True, False, False, False, True], [False, True, True, False, False, True, True, False]]

fours = [[False, True, False, True, False, True, False, True], [False, True, True, True, False, True, True, True], [
    False, False, False, True, False, False, False, True], [False, False, False, True, False, False, False, True]]

fives = [[False, True, True, True, False, True, True, True], [False, True, True, False, False, True, True, False], [
    False, False, False, True, False, False, False, True], [False, False, True, False, False, False, True, False]]

sixes = [[False, False, True, True, False, False, True, True], [False, True, False, False, False, True, False, False], [
    False, True, True, True, False, True, True, True], [False, True, True, False, False, True, True, False]]

sevens = [[False, True, True, True, False, True, True, True], [False, False, False, True, False, False, False, True], [
    False, False, True, False, False, False, True, False], [False, True, False, False, False, True, False, False]]

eights = [[False, True, True, True, False, True, True, True], [False, True, True, True, False, True, True, True], [
    False, True, False, True, False, True, False, True], [False, True, True, True, False, True, True, True]]

nines = [[False, False, True, True, False, False, True, True], [False, True, True, True, False, True, True, True], [
    False, False, False, True, False, False, False, True], [False, True, True, False, False, True, True, False]]

numberMap = {
    '0': zeroes,
    '1': ones,
    '2': twos,
    '3': threes,
    '4': fours,
    '5': fives,
    '6': sixes,
    '7': sevens,
    '8': eights,
    '9': nines
}

color_ranges = [
    (range(88, 100), [211, 49, 21]),
    (range(75, 87), [226, 115, 0]),
    (range(62, 74), [252, 196, 0]),
    (range(49, 61), [176, 188, 0]),
    (range(36, 48), [104, 188, 0]),
    (range(23, 35), [22, 165, 165]),
    (range(10, 22), [0, 156, 224]),
    (range(0, 9), [123, 100, 255]),
]


def get_tens(pixels, number_string):
    mapped = numberMap[number_string]

    for rowi, row in enumerate(mapped):
        if rowi not in pixels:
            pixels.append([])

        for i, item in enumerate(row):
            if i < 5:
                pixels[rowi].append(item)


def get_ones(pixels, number_string):
    mapped = numberMap[number_string]

    for rowi, row in enumerate(mapped):
        for i, item in enumerate(row):
            if i > 4:
                pixels[rowi].append(item)


def number_to_pixels(number, rgb):
    [tens, ones] = str(number)

    pixels = []

    get_tens(pixels, tens)
    get_ones(pixels, ones)

    return colorize_pixels(pixels, rgb)


def colorize_pixels(pixels, rgb):
    for rowi, row in enumerate(pixels):
        for celli, cell in enumerate(row):
            if cell is True:
                pixels[rowi][celli] = rgb
            else:
                pixels[rowi][celli] = [0, 0, 0]

    return pixels
