<?php
$filePath = 'bestTimes.txt';
$lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

if ($lines === false) {
    die('Error reading file: ' . $filePath);
}

// Sort the lines based on time and moves
usort($lines, function($a, $b) {
    list($timeA, $movesA) = explode(', ', $a);
    list($timeB, $movesB) = explode(', ', $b);

    $timeAInSeconds = intval($timeA);
    $timeBInSeconds = intval($timeB);

    if ($timeAInSeconds != $timeBInSeconds) {
        return $timeAInSeconds - $timeBInSeconds;
    } else {
        $movesA = intval(explode(' ', $movesA)[0]);
        $movesB = intval(explode(' ', $movesB)[0]);
        return $movesA - $movesB;
    }
});

// Return the top 10 scores as JSON
$topScores = array_slice($lines, 0, 10);
echo json_encode($topScores);
?>
