from __future__ import print_function, division
import itertools
import csv, numpy


def weighted(arr):
	if len(arr) < 1:
		return 0
	elif len(arr) == 1:
		return arr[0]
	else:
		sortarr = sorted(arr)
		std = numpy.std(arr) / 2
		i = 0
		while (i + 1) < len(sortarr):
			dev = sortarr[i + 1] - sortarr[i]
			if (dev >= std):
				break;
			else:
				i += 1
		weight = (i + 1) / len(sortarr)
		rest = (len(sortarr) - (i + 1)) / len(sortarr)
		top = numpy.mean(sortarr[:(i + 1)])
		if len(sortarr[:(i + 1)]) == len(sortarr):
			return top
		bot = numpy.mean(sortarr[(i + 1):])
		top *= weight
		bot *= rest
		return (top + bot) / 2

def translate(value):
	if value > 100:
		return 1

	leftMax = 0
	leftMin = 100
	rightMax = 100
	rightMin = 1
    # Figure out how 'wide' each range is
	leftSpan = leftMax - leftMin
	rightSpan = rightMax - rightMin

    # Convert the left range into a 0-1 range (float)
	valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
	return round(rightMin + (valueScaled * rightSpan), 2)

def fit(arr1, arr2):

	if (abs(arr1[0] - arr2[0]) > abs(numpy.mean(arr1) - numpy.mean(arr2))) and (len(arr1) > 6) and (len(arr2) > 6):
		arr1.remove(arr1[0])
		arr2.remove(arr2[0])
		return fit(arr1, arr2)
	elif (abs(arr1[len(arr1) - 1] - arr2[len(arr2) - 1]) > abs(numpy.mean(arr1) - numpy.mean(arr2))) and (len(arr1) > 6) and (len(arr2) > 6):
		arr1.remove(arr1[len(arr1) - 1])
		arr2.remove(arr2[len(arr2) - 1])
		return fit(arr1, arr2)

	if len(arr1) > len(arr2):
		while len(arr1) > len(arr2):
			l = [ abs(arr1[0] - arr2[0]), abs(arr1[len(arr1) - 1] - arr2[len(arr2) - 1])]
			if max(l) == abs(arr1[0] - arr2[0]):
				arr1.remove(arr1[0])
			else:
				arr1.remove(arr1[len(arr1) - 1])
	elif len(arr2) > len(arr1):
		while len(arr2) > len(arr1):
			l = [abs(arr1[0] - arr2[0]), abs(arr1[len(arr1) - 1] - arr2[len(arr2) - 1])]
			if max(l) == abs(arr1[0] - arr2[0]):
				arr2.remove(arr2[0])
			else:
				arr2.remove(arr2[len(arr2) - 1])

	return arr1, arr2


playerdict = {}
with open("player_ranking_search.csv", 'rb') as f:
		reader = csv.DictReader(f)
		for row in reader:
			if int(row["ranking"]) <= 175:
				if (row["name"] not in playerdict):
					ranks = []
					years = []
					ranks.append(int(row["ranking"]))
					years.append(int(row["year"]))
					playerdict[row["name"]] = [ranks, years]
				else:
					playerdict[row["name"]][0].append(int(row["ranking"]))
					playerdict[row["name"]][1].append(int(row["year"]))
for name in playerdict:
	rankings = playerdict[name][0]
	years = playerdict[name][1]
	playerdict[name] = {
	"rankings": rankings,
	"years": years,
	"weighted_avg_rank": round(weighted(rankings), 2),
	"diffs" : [[1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""],
				[1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""], [1000, ""]],
	"newdiffs": [],
	"projected_rankings": []
	}

keys = playerdict.keys()

for i in range(len(keys)):

	player = keys[i]
	j = i + 1
	while j < len(keys):
		player2 = keys[j]

		#compare current players with the first years of old players
		if max(playerdict[player]["years"]) >= 2015 and max(playerdict[player2]["years"]) < 2015\
			and max(playerdict[player2]["years"]) > max(playerdict[player]["years"]):

			p2_years = list(playerdict[player2]["years"])
			while (len(playerdict[player]["years"]) < len(p2_years)):
				p2_years.remove(p2_years[len(p2_years) - 1])

			avg_rank1 = playerdict[player]["weighted_avg_rank"]
			avg_rank2 = round(weighted(p2_years), 2)
			diff = round(abs(avg_rank1 - avg_rank2), 2)

			if (diff < max(playerdict[player]["diffs"])[0]):
				playerdict[player]["diffs"].remove(max(playerdict[player]["diffs"]))
				playerdict[player]["diffs"].append([diff, player2])
				playerdict[player]["diffs"].sort()

			#if within a reasonable career length margin, we're allowing old players to compare to new players.
			if (diff < max(playerdict[player2]["diffs"])[0]) and\
				abs(len(playerdict[player]["years"]) - len(playerdict[player2]["years"])) <= 3:
				playerdict[player2]["diffs"].remove(max(playerdict[player2]["diffs"]))
				playerdict[player2]["diffs"].append([diff, player])
				playerdict[player2]["diffs"].sort()
		
		elif max(playerdict[player]["years"]) < 2015 and max(playerdict[player2]["years"]) >= 2015\
			and max(playerdict[player]["years"]) > max(playerdict[player2]["years"]):

			p1_years = list(playerdict[player]["years"])

			while (len(playerdict[player2]["years"]) < len(p1_years)):
				p1_years.remove(p1_years[len(p1_years) - 1])

			avg_rank1 = round(weighted(p1_years), 2)
			avg_rank2 = playerdict[player2]["weighted_avg_rank"]
			
			diff = round(abs(avg_rank1 - avg_rank2), 2)

			if (diff < max(playerdict[player]["diffs"])[0]) and\
				abs(len(playerdict[player]["years"]) - len(playerdict[player2]["years"])) <= 3:
				playerdict[player]["diffs"].remove(max(playerdict[player]["diffs"]))
				playerdict[player]["diffs"].append([diff, player2])
				playerdict[player]["diffs"].sort()

			if (diff < max(playerdict[player2]["diffs"])[0]):
				playerdict[player2]["diffs"].remove(max(playerdict[player2]["diffs"]))
				playerdict[player2]["diffs"].append([diff, player])
				playerdict[player2]["diffs"].sort()
		else:
			avg_rank1 = playerdict[player]["weighted_avg_rank"]
			avg_rank2 = playerdict[player2]["weighted_avg_rank"]
			diff = round(abs(avg_rank1 - avg_rank2), 2)
			if (diff < max(playerdict[player]["diffs"])[0]):
				playerdict[player]["diffs"].remove(max(playerdict[player]["diffs"]))
				playerdict[player]["diffs"].append([diff, player2])
				playerdict[player]["diffs"].sort()
			if (diff < max(playerdict[player2]["diffs"])[0]):
				playerdict[player2]["diffs"].remove(max(playerdict[player2]["diffs"]))
				playerdict[player2]["diffs"].append([diff, player])
				playerdict[player2]["diffs"].sort()
		j += 1
		



for i in range(len(keys)):
	player1 = keys[i]
	player1rankings = list(playerdict[player1]["rankings"])
	player1diffs = playerdict[player1]["diffs"]
	j = 0
	while j < len(player1diffs):
		player2 = player1diffs[j][1]
		player2rankings = list(playerdict[player2]["rankings"])
		if len(player1rankings) != len(player2rankings):
			player1rankings = fit(player1rankings, player2rankings)[0]
			player2rankings = fit(player1rankings, player2rankings)[1]
		newdiff = 1
		for i in range(len(player1rankings)):
			dissim = translate(abs(player1rankings[i] - player2rankings[i])) / 100
			newdiff *= dissim
		playerdict[player1]["newdiffs"].append([round(newdiff, 2), player2])
		j += 1
	playerdict[player1]["newdiffs"] = sorted(playerdict[player1]["newdiffs"], reverse=True)
	playerdict[player1]["diffs"] = []

for i in range(len(keys)):
	player1 = keys[i]
	if max(playerdict[player1]["years"]) >= 2015:
		player1rankings = list(playerdict[player1]["rankings"])
		player1newdiffs= playerdict[player1]["newdiffs"]
		l = []
		for j in range(len(player1rankings) // 2):
			player2 = player1newdiffs[j][1]
			l.append(playerdict[player2]["rankings"])
		get_pos = itertools.izip_longest(*l)
		li = [[e for e in k if e is not None] for k in get_pos]
		final = [round(sum(u) / len(u)) for u in li]
		proj = final[len(player1rankings):]
		if len(player1rankings) >= (len(final) - 3):
			proj = final[-3:]
		proj = proj[-3:]
		playerdict[player1]["projected_rankings"] = proj


with open("player_comparisons.csv", "wb") as f:
	fieldnames = ['name', 'player1', 'player1sim', 'player2', 'player2sim', 'player3', 'player3sim', 'proj_rankings']
	writer = csv.DictWriter(f, fieldnames=fieldnames)
	for i in playerdict:
		writer.writerow({
		"name": i,
		"player1": playerdict[i]["newdiffs"][0][1], "player1sim": playerdict[i]["newdiffs"][0][0],
		"player2": playerdict[i]["newdiffs"][1][1] , "player2sim": playerdict[i]["newdiffs"][1][0],
		"player3": playerdict[i]["newdiffs"][2][1],  "player3sim": playerdict[i]["newdiffs"][2][0],
		"proj_rankings": playerdict[i]["projected_rankings"]})
